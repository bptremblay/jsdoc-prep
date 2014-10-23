class seurat::build_server {
  package { 'rpm-build':
    ensure => 'installed',
  }
  package { 'rubygem-fpm':
    ensure => 'installed',
    require => [
      Package['rpm-build'],
    ],
  }
  package { 'rubygem-env_checker':
    ensure => 'installed',
  }
  package { 'rubygem-rpm_maker':
    ensure => 'installed',
  }
  package { 'createrepo':
    ensure => 'installed',
  }
}
